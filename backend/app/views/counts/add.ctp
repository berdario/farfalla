<div class="counts form">
<?php echo $this->Form->create('Count');?>
	<fieldset>
		<legend><?php __('Add Count'); ?></legend>
	<?php
		echo $this->Form->input('participant');
		echo $this->Form->input('url');
		echo $this->Form->input('lw');
		echo $this->Form->input('nw');
		echo $this->Form->input('ns');
	?>
	</fieldset>
<?php echo $this->Form->end(__('Submit', true));?>
</div>
<div class="actions">
	<h3><?php __('Actions'); ?></h3>
	<ul>

		<li><?php echo $this->Html->link(__('List Counts', true), array('action' => 'index'));?></li>
	</ul>
</div>